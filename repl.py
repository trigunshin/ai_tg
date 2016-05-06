import time
import pyautogui
PAUSE = .1
pyautogui.PAUSE = PAUSE
pyautogui.FAILSAFE = True

screenWidth, screenHeight = pyautogui.size()
pyautogui.moveTo(screenWidth / 2, screenHeight / 2)
area_middle = (763, 459)

# global
spray_ants_button = (1046, 730)
area_select_open = (930, 290)

#button
area_select_button = (944, 387)

# garden
area_select_garden = (950, 340)
garden_gray_seed = (517, 610)  # 5m15s expiration
garden_plantall_button = (834, 610)
garden_another_button = (610, 500)
garden_another_seed_button = (556, 606)
garden_another_seed_51 = (561, 450)  # 22m expiration

# arena
area_select_arena = (944, 370)
power_attack_button = (674, 611)

# REPLANT TREES
def tree(nextAction=None):
	# wait, then move to gatden
	time.sleep(3)
	pyautogui.moveTo(*area_select_open)
	pyautogui.moveTo(*area_select_garden)
	pyautogui.click()
	# normal trees
	pyautogui.moveTo(*garden_gray_seed)
	pyautogui.click()
	pyautogui.moveTo(*garden_plantall_button)
	pyautogui.click()
	# another garden
	pyautogui.moveTo(*garden_another_button)
	pyautogui.click()
	pyautogui.moveTo(*garden_another_seed_button)
	pyautogui.click()
	pyautogui.moveTo(*garden_another_seed_51)
	pyautogui.click()
	pyautogui.moveTo(*garden_plantall_button)
	pyautogui.click()

	# done
	if nextAction:
		nextAction()

def move_arena():
	time.sleep(3)
	pyautogui.moveTo(*area_select_open)
	pyautogui.moveTo(*area_select_arena)
	pyautogui.click()
	pyautogui.moveTo(area_middle)
	pyautogui.click()

def power_idle():
	PAUSE = .001
	pyautogui.PAUSE = PAUSE
	while True:
		pyautogui.press('s')
		pyautogui.press('w')
		for i in range(15):
			pyautogui.press('c')
		pyautogui.press('w')

def rapid_idle():
	PAUSE = .001
	pyautogui.PAUSE = PAUSE
	while True:
		pyautogui.press('s')
		pyautogui.press('v')
		# pyautogui.press('w')
		for i in range(15):
			pyautogui.press('x')
		# pyautogui.press('w')

#time.sleep(3)
#tree(farm_arena)

#time.sleep(3)
#farm_arena()

# pirate ship interipr w/rapidfire build
repeat_time = 1 * 60 * 5 + 20  # 5m20s
while True:
	tree()  # small_tree takes 5m15s
	move_arena()
	
	total_time = 0
	while total_time < repeat_time:
		pyautogui.keyUp('x')
		pyautogui.press('w')
		pyautogui.keyDown('x')

		# 10 second delay, PAUSE delay
		total_time = total_time + 10 + PAUSE * 3

		for i in range(int(10/PAUSE)):
			# pyautogui.click()
			pyautogui.press('w')

	# time.sleep(repeat_time)
	pyautogui.keyUp('x')


import time, threading
from functools import partial
repeat_farm = partial(tree, farm_arena)
repeat_time = 1 * 60 * 5 + 20  # 5m20s
# threading.Timer(1 * 60 * 5 + 20, repeat_farm).start()


while True:
	pyautogui.keyUp('c')
	pyautogui.keyDown('w')
	pyautogui.keyUp('w')
	pyautogui.keyDown('c')
	time.sleep(10)

# powershot farm corruption?... or anything w/mana pot
while True:
	pyautogui.keyUp('c')
	pyautogui.keyDown('w')
	pyautogui.keyUp('w')
	pyautogui.keyDown('c')

	for i in range(int(8/PAUSE)):
		# pyautogui.click()
		pyautogui.press('w')

repeat_time = 1 * 60 * 5 + 20  # 5m20s
while True:
	tree()  # small_tree takes 5m15s
	move_arena()
	
	total_time = 0
	pyautogui.keyDown('x')
	while total_time < repeat_time:
		# 10 second delay, PAUSE delay
		total_time = total_time + 10 + int(10/PAUSE)

		for i in range(int(10/PAUSE)):
			pyautogui.click()
			# pyautogui.press('w')

	# time.sleep(repeat_time)
	pyautogui.keyUp('x')




repeat_time = 1 * 60 * 5 + 20  # 5m20s
while True:
	tree()  # small_tree takes 5m15s
	move_arena()
	
	total_time = 0
	pyautogui.keyDown('c')
	while total_time < repeat_time:
		# 10 second delay, PAUSE delay
		total_time = total_time + 10 + PAUSE * 3

		for i in range(int(10/PAUSE)):
			# pyautogui.click()
			pyautogui.press('w')

	# time.sleep(repeat_time)
	pyautogui.keyUp('c')



PAUSE = .001
pyautogui.PAUSE = PAUSE
while True:
	pyautogui.press('s')
	pyautogui.press('w')
	for i in range(30):
		pyautogui.press('c')
	pyautogui.press('w')

PAUSE = 1
pyautogui.PAUSE = PAUSE
repeat_time = 1 * 60 * 5 + 20  # 5m20s
while True:
	tree()  # small_tree takes 5m15s
	move_arena()
	
	total_time = PAUSE
	pyautogui.keyDown('x')
	while total_time < repeat_time:
		# 10 second delay, PAUSE delay

		for i in range(int(10/PAUSE)):
			pyautogui.click()
			total_time = total_time + 1 * PAUSE
			# pyautogui.press('w')

	# time.sleep(repeat_time)
	pyautogui.keyUp('x')
	# total_time = total_time + 1 * PAUSE