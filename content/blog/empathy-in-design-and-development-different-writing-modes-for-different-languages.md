---
title: "Empathy in Design and Development: Different writing modes for different languages"
date: "2017-10-02"
---

Figures 6 and 7, sideways writing modes, will not work on Chrome. If you want to see what they look like, try viewing the page in Firefox.

People who I deeply admire and whose work I respect have been working on how to layout languages other than English and Latin languages on the web and how we can combine these languages in the same layout.

I will concentrate on direction, writing modes, and text orientation as these are the easiest ones to work with and the ones that will have a big impact on how text appears on your web content.

The following examples, copied from [Jen Simmons' Labs](http://labs.jensimmons.com/2017/workshop/writingmode-1A.html) and it shows different writing modes, direction, and vertical alignment.

**Figure 1** is the standard that we're used for English and most European languages, including Greek and Cyrillic. We read from top to bottom and left to right.

# Basic defaults

(1) Around 1040, the first known movable type system was created in China by Bi Sheng out of porcelain. Sheng used clay type, which broke easily, but Wang Zhen by 1298 had carved a more durable type from wood. (2) Copper movable type printing originated in China at the beginning of the 12th century. It was used in large-scale printing of paper money issued by the Northern Song dynasty. Movable type spread to Korea during the Goryeo Dynasty. (3) Around 1230, Koreans invented a metal type movable printing using bronze. The Jikji, published in 1377, is the earliest known metal printed book. (4) Around 1450, Johannes Gutenberg introduced what is regarded as the first modern movable type system in Europe.

direction: ltr; writing-mode: horizontal-tb;

Something like **figure 2** was my first experience with languages and layouts other than English. Arabic and Hebrew write text from right to left. Figure 2 also shows what English looks like when written from right to left instead of our traditional left to right layout.

# Set Direction to RTL

(1) Around 1040, the first known movable type system was created in China by Bi Sheng out of porcelain. Sheng used clay type, which broke easily, but Wang Zhen by 1298 had carved a more durable type from wood. (2) النحاس نوع المنقولة الطباعة نشأت في الصين في بداية القرن 12th. انه كان يستخدم في الطباعة على نطاق واسع من النقود الورقية التي تصدرها سلالة سونغ الشمالية. نوع المنقولة انتشار لكوريا خلال عصر مملكة كوريو. (3) حول 1230، اخترع الكوريين الطباعة المنقولة نوع المعدن باستخدام البرونزية. وجيكجي، التي نشرت في 1377، هو أقرب المعادن طبع كتاب معروف. (4) حوالي 1450، قدم يوهانس غوتنبرغ ما يعتبر أول نظام نوع المنقولة الحديثة في أوروبا.

_direction: rtl;_ writing-mode: horizontal-tb;

The first big surprise came when I saw figure 3 and later in Jen's presentation When working with languages other than Latin and European languages. We can write languages like Japanese like we write English (horizontal, left to right) or we can write them vertically (vertical top to bottom, right to left).

# Set Writing Mode to vertical-rl

(1) Around 1040, the first known movable type system was created in China by Bi Sheng out of porcelain. Sheng used clay type, which broke easily, but Wang Zhen by 1298 had carved a more durable type from wood. (2) Copper movable type printing originated in China at the beginning of the 12th century. It was used in large-scale printing of paper money issued by the Northern Song dynasty. Movable type spread to Korea during the Goryeo Dynasty. (3) 大约1230年，韩国人发明了一种使用青铜的金属型可移动印刷。 吉吉，出版于1377年，是最早知道的金属印刷书。 (4) 约1450年左右，约翰内斯·古登伯格介绍了被认为是欧洲第一个现代可移动式系统。

direction: ltr; _writing-mode: vertical-rl;_ text-orientation: mixed;

We can do the same thing while flipping the text to go from left to right. The English reads a little weird but it's not the target language for this layout.

# Set Writing Mode to vertical-lr;

(1) Around 1040, the first known movable type system was created in China by Bi Sheng out of porcelain. Sheng used clay type, which broke easily, but Wang Zhen by 1298 had carved a more durable type from wood. (2) Copper movable type printing originated in China at the beginning of the 12th century. It was used in large-scale printing of paper money issued by the Northern Song dynasty. Movable type spread to Korea during the Goryeo Dynasty. (3) Around 1230, Koreans invented a metal type movable printing using bronze. The Jikji, published in 1377, is the earliest known metal printed book. (4) Around 1450, Johannes Gutenberg introduced what is regarded as the first modern movable type system in Europe.

direction: ltr; _writing-mode: vertical-lr;_ text-orientation: mixed;

The sideways text addresses another set of non-western / non-European languages. We can also use sideways text to create interesting layouts for our content.

# Set Writing Mode to sideways-rl

(1) Around 1040, the first known movable type system was created in China by Bi Sheng out of porcelain. Sheng used clay type, which broke easily, but Wang Zhen by 1298 had carved a more durable type from wood. (2) Copper movable type printing originated in China at the beginning of the 12th century. It was used in large-scale printing of paper money issued by the Northern Song dynasty. Movable type spread to Korea during the Goryeo Dynasty. (3) 大约1230年，韩国人发明了一种使用青铜的金属型可移动印刷。 吉吉，出版于1377年，是最早知道的金属印刷书。 (4) Around 1450, Johannes Gutenberg introduced what is regarded as the first modern movable type system in Europe.

direction: ltr; _writing-mode: sideways-rl;_

# Set Writing Mode to sideways-lr

(1) Around 1040, the first known movable type system was created in China by Bi Sheng out of porcelain. Sheng used clay type, which broke easily, but Wang Zhen by 1298 had carved a more durable type from wood. (2) Copper movable type printing originated in China at the beginning of the 12th century. It was used in large-scale printing of paper money issued by the Northern Song dynasty. Movable type spread to Korea during the Goryeo Dynasty. (3) 大约1230年，韩国人发明了一种使用青铜的金属型可移动印刷。 吉吉，出版于1377年，是最早知道的金属印刷书。 (4) Around 1450, Johannes Gutenberg introduced what is regarded as the first modern movable type system in Europe.

direction: ltr; _writing-mode: sideways-lr;_

The final piece of surprise was the vertical layout for languages like Japanese. It'll work with English and other western languages but, as you can see in figures 8 and 9, it looks odd when used with western languages but looks as intended when used with Japanese and other eastern languages.

# Upright

1 Around 1040, the first known movable type. 2 Copper movable type printing originated in China. 3 1230左右，韩国人发明了一种金属型活动印刷 4 Around 1450, Johannes [Gutenberg](https://www.wikiwand.com/en/Johannes_Gutenberg).

direction: rtl; _writing-mode: vertical-rl; text-orientation: upright;_

# Upright

1 Around 1040, the first known movable type. 2 Copper movable type printing originated in China. 3 1230左右，韩国人发明了一种金属型活动印刷 4 Around 1450, Johannes Gutenberg.

direction: ltr; _writing-mode: vertical-lr; text-orientation: upright;_

You may wonder why we went into this excursion into writing modes, writing directions and text orientations. It's important to know that we can write text in the direction, writing mode and orientation that is appropriate to the languages you're working on. We can also use these writing modes combined to do direct quotations in one language versus another. Knowing about this also helps when working with localized landing pages or we need to understand how languages other than English and European languages will impact our layouts.

Again, put the users (not just English speakers and European languages) first.
