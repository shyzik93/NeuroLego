from PIL import Image
import glob

fpath = '/storage/emulated/0/qpython/scripts3/'

for i, fi in enumerate(glob.glob(fpath+'img_orig/*.jpg')):
    print(i, fi)
    im =  Image.open(fi)
    
    im.thumbnail((400, 300))
    
    px = im.load()
    for x in range(400):
        for y in range(300):
            avr = (px[x,y][0] + px[x,y][1] + px[x,y][2]) // 3

            #if avr > 190: avr = 255
            avr = int(avr * 1.8)
            if avr > 255: avr = 255
            
            #if avr > 200: avr = 255
            
            #if avr < 200: avr = avr // 2
            
            #if avr < 10: avr = 0
            
            px[x,y] = (avr, avr, avr)
    
    im.save(fpath+'img_transformed/'+fi.split('/')[-1], 'JPEG', quality=100)

'''
for i, fi in enumerate(glob.glob(fpath+'img_transformed/*.jpg')):
    print(i, fi)
    im =  Image.open(fi)
    im.save(fpath+'img_transformed/'+fi.split('/')[-1], 'JPEG', quality=100)
'''