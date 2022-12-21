import cv2
import tkinter
import tkinter.font
from PIL import Image, ImageTk

width, height = 1280, 720
cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, width)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, height)

window = tkinter.Tk()
window.geometry("1400x920+100+0")
window.title("Aussie SHOT")
#root.bind('<Escape>', lambda e: root.quit())
lmain = tkinter.Label(window)
lmain.pack()

def show_frame():
    _, frame = cap.read()
    frame = cv2.flip(frame, 1)
    cv2image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGBA)
    img = Image.fromarray(cv2image)
    imgtk = ImageTk.PhotoImage(image=img)
    lmain.imgtk = imgtk
    lmain.configure(image=imgtk)
    lmain.after(1, show_frame)

show_frame()
window.mainloop()