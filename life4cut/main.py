import cv2
from PIL import Image
from datetime import datetime

webcam = cv2.VideoCapture(0) # 여기서 파라미터는 몇번째 웹캠 말하는거라고 함
# path = '/Users/junyoungjoun/Documents/GitHub/junsik-universe/life4cut'

# vid_cod = cv2.VideoWriter_fourcc(*'DIVX')
# output = cv2.VideoWriter("life4cut/video/cam_video.avi", vid_cod, 20.0, (640,480))

if not webcam.isOpened():
    print("Could not open webcam")
    exit()

i = 0
while webcam.isOpened():
    status, frame = webcam.read()
    
    if status:
        inversed = cv2.flip(frame, 1)
        cv2.imshow("life4cut - " + str(i), inversed)
        # output.write(inversed)

    if cv2.waitKey(1) == ord('c'):
        print("capture")
        cv2.imwrite('life4cut/photos/test'+str(i)+'.jpg', frame)
        i += 1

    if cv2.waitKey(1) == ord('q'):
        break

    if i == 4 :
        break

webcam.release()
# output.release()
cv2.destroyAllWindows()

for i in range(0, 4):
    im = Image.open('life4cut/photos/test'+str(i)+'.jpg')
    crop_px = round((im.width - (im.height * 1.48648649)) / 2)
    im2 = im.crop((crop_px , 0, im.width - crop_px, im.height)) # 앞 두 숫자는 처음 x, y 그리고 마지막 x, y
    im2.save('life4cut/photos/crop'+str(i)+'.jpg')

print("CROP - COMPLETE")

canvas = Image.open('life4cut/frames/canvas.png')
photoFrame = Image.open('life4cut/frames/frame1.png')

positionX = 25
positionY = 17
growth = 384

for i in range(0, 4):
    im = Image.open('life4cut/photos/crop' + str(i) + '.jpg')
    im = im.resize((550, 370), Image.ANTIALIAS)
    area = (positionX, positionY, positionX + im.width, positionY + im.height)
    canvas.paste(im, area)
    positionY += growth

#canvas.paste(photoFrame, (0, 0, photoFrame.width, photoFrame.height))
photoFrame = photoFrame.convert('RGBA')
canvas = Image.alpha_composite(canvas, photoFrame)
canvas = canvas.convert('RGB')
canvas.show()
canvas.save('life4cut/results/' + str(datetime.today()) + '.jpg')

im.close()
im2.close()
canvas.close()
photoFrame.close()