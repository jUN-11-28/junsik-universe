import cv2
import tkinter
import tkinter.font
from PIL import Image, ImageTk

window = tkinter.Tk()
window.bind('<Escape>', lambda e: window.quit())
window.title("Aussie SHOT")
window.geometry("1400x920+100+0")

headTitleFont = tkinter.font.Font(size=40, weight="bold")
headTitle = tkinter.Label(window, text="Welcome to Aussie SHOT", font=headTitleFont, height=2)
headTitle.pack()

## 메인 카메라 화면
screenMain = tkinter.Label(window)
screenMain.pack()

## 카메라 세팅
width, height = 1280, 720
webcam = cv2.VideoCapture(0)
webcam.set(cv2.CAP_PROP_FRAME_WIDTH, width)
webcam.set(cv2.CAP_PROP_FRAME_HEIGHT, height)

if not webcam.isOpened():
    print("Could not open webcam")
    exit()

count = 4
take = 0
def show_cam():
    _, frame = webcam.read()
    global count
    global take
    if take == 1:
        print("capture")
        take = 0
        cv2.imwrite('life4cut/photos/test'+str(3 - count)+'.jpg', frame)
        createFrame()
    if count == 0:
        webcam.release()
        cv2.destroyAllWindows()
        screenMain.pack_forget()

    else :
        inversed = cv2.flip(frame, 1)
        cv2image = cv2.cvtColor(inversed, cv2.COLOR_BGR2RGBA)
        screenImg = Image.fromarray(cv2image)
        imgtk = ImageTk.PhotoImage(image=screenImg)
        screenMain.imgtk = imgtk
        screenMain.configure(image=imgtk)
        screenMain.after(1, show_cam)

canvas = Image.open('life4cut/frames/canvas.png')
def createFrame():
    positionX = 25
    positionY = 17
    growth = 384

    for i in range(0, 4):
        im = Image.open('life4cut/photos/crop' + str(i) + '.jpg')
        im = im.resize((550, 370), Image.ANTIALIAS)
        area = (positionX, positionY, positionX + im.width, positionY + im.height)
        canvas.paste(im, area)
        positionY += growth
    selectFrame()

frameNumber = 1
def frameNumberUp():
    if frameNumber == 5:
        frameNumber = 1
    else:
        frameNumber += 1

def selectFrame():
    global frameNumber
    nextButton = tkinter.Button(window, text="next", command=frameNumberUp)
    nextButton.pack()
    photoFrame = Image.open('life4cut/frames/frame' + str(frameNumber) + '.png')
    photoFrame = photoFrame.convert('RGBA')
    temp = Image.alpha_composite(canvas, photoFrame)


def selected():
    

def start():
    global count
    headTitle.config(text="You can take " + str(count) + " shots")
    startButton.pack_forget()
    shotButton.pack()
    show_cam()

startButton = tkinter.Button(window, text="start", font=headTitleFont, command=start)
startButton.pack()

chooseButton = tkinter.Button(window, text="select", font=headTitleFont, command=selected)

def shot():
    global frame
    global count
    global take
    take = 1
    count -= 1
    headTitle.config(text=str(count)+ " left")

shotButton = tkinter.Button(window, text="shot", font=headTitleFont, command=shot)

window.mainloop()