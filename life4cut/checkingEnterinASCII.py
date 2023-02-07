import keyboard

def press_callback(e):
    if e.name == "enter":
        print("Enter")
    elif e.name == "up":
        print("Up")

keyboard.on_press(press_callback)

keyboard.wait()