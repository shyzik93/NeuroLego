import os
from PIL import Image, ImageDraw
import glob

def find_marked(im, pxs_orig, pxs, mark, fdir):
    global count, symbols
    
    rows = []
    max_x=max_y=0
    min_x=im.size[0]
    min_y=im.size[1]
    for y in range(im.size[1]):
        #row = []
        for x in range(im.size[0]):
            if mark == pxs[x,y]:
                rows.append((x,y))
                pxs[x,y] = (255,255,255)
                if x < min_x: min_x=x
                if y < min_y: min_y = y
                if x > max_x: max_x = x
                if y > max_y: max_y = y
        #if len(row) > 5: rows.append(row)
    if len(rows) < 5: return
    
    #print((min_x,min_y), (max_x,max_y),(max_x-min_x+1, max_y-min_y+1))
    im3 = Image.new('P', (max_x-min_x+1, max_y-min_y+1), 255)
    #print(im3.size)
    pxs3 = im3.load()
    for px in rows:
        #print(pxs_orig[px], px, (px[0]-min_x, px[1]-min_y))
        pxs3[px[0]-min_x, px[1]-min_y] = pxs_orig[px][0]
    path = fdir+str(count).rjust(3, '0')+'.png'
    im3.save(path, 'PNG', quality=100)
    #print(rows)
    count += 1
    symbols.append([path.split('/')[-1], (min_x,min_y), (max_x,max_y)])
 
def mark_all(im, pxs, mark):
    for y in range(im.size[1]):
        for x in range(im.size[0]):
            if mark == pxs[x,y]: continue
            px = pxs[x,y][0]
        
            if px < 160:
                ImageDraw.floodfill(im, (x,y), mark)#, (255,255,255))

fpath = '/storage/emulated/0/qpython/scripts3/'

for i, fi in enumerate(glob.glob(fpath+'img_transformed/*.jpg')):

    count = 0
    symbols = []

    #fi = fpath + 'img_transformed/IMG_20190322_114129.jpg'

    fdir = '.'.join(fi.split('.')[:-1])+'/'
    if not os.path.exists(fdir): os.mkdir(fdir)

    print(fi)

    im = Image.open(fi)
    pxs = im.load()

    im_orig = Image.open(fi)
    pxs_orig = im_orig.load()

    mark = (100,210,120)
    mark2 = (210,100,120)

    mark_all(im, pxs, mark)

    im.save(fi+'2', 'JPEG', quality=100)

    for y in range(im.size[1]):
        for x in range(im.size[0]):
            if mark == pxs[x,y]:
                ImageDraw.floodfill(im, (x,y), mark2)#, (255,255,255))
                find_marked(im, pxs_orig, pxs, mark2, fdir)

    #im.save(fi+'3', 'JPEG', quality=100)

#print(symbols)

'''row = []
for i, s in enumerate(symbols):
    name, minsides, maxsides = s
    
    if len(row) == 0:
        row.append(s)
        continue
    for i2, s2 in enumerate(row):
        name2, minsides2, maxsides2 = s2
        if minsides[0] < minsides2[0]:
            row.insert(s, i2)
            continue

print(row)'''

