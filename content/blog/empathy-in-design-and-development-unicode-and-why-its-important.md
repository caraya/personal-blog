---
title: "Empathy in Design and Development: Unicode and why it's important"
date: "2017-09-27"
---

Before we jump into the mechanics of displaying content in languages other than English on the web, we need to take a little detour and speak about `character encodings`, `character sets`, `code points`, `ASCII`, `Unicode` and `fonts`. These definitions have helped me get a better handle on how to work with languages other than English.

**Character Sets, Code Pages, and Character encodings**

Information derived from [Character sets, coded character sets, and encodings](https://www.w3.org/International/articles/definitions-characters/#charsets)

Whenever we work with text in a computer we need to worry about the language we're writing in and how will the interpreted and displayed to the user. Until Unicode came around the main problem was that the same number will represent different characters depending on what encoding we use.

A **character set** is the set of characters we use to support a given language, be it English, Mandarin or Celtic languages. This is independent of the medium we use to write the characters.

A **coded character set** (also referred to as code page) is a set of characters where each character has a unique number assigned to it. Units of a coded character set are known as code points.

A **code point** value represents the position of a character in the coded character set. For example, the code point for the letter `á` in the Unicode coded character set is 225 in decimal or E1 in hexadecimal notation.

The **character encoding** reflects the way the coded character set is mapped to bytes for manipulation in a computer.

It is also important to note that, depending on the encoding, a character may take more than one byte of storage space. We'll look at this in more detail when we discuss ISO-8859 and Unicode.

### ASCII

**ASCII** (American Standard Code for Information Interchange) is an older 7-bit encoding used in teleprinters and early Internet devices. ASCII encodes 128 specified characters into seven-bit integers. The characters encoded are numbers 0 to 9, lowercase letters a to z, uppercase letters A to Z, basic punctuation symbols, control codes that originated with Teletype machines, and space.

ASCII was OK while the Internet was only used in Eglish (either native speakers or researchers who spoke the language) but it became an issue as the Internet grew more multicultural and exploded when the web became a public space and a graphical space with Mosaic and early versions of Netscape and Internet Explorer.

### ISO/IEC 8859

The **ISO-8859** family of standard, or more specifically ISO/IEC 8859, seeks to address the shortcomings of ASCII when it comes to languages other than English. These other languages need additional characters that are outside the range of the English alphabet. Because ASCII already exhausted the number of characters that you can use with 7 bits so they added another 96 characters by using 2 additional group of characters. Wikipedia describes the 8859 encodings as:

> The ISO/IEC 8859-n encodings only contain printable characters and were designed to be used in conjunction with control characters mapped to the unassigned bytes. To this end a series of encodings registered with the IANA, the [C0](https://www.wikiwand.com/en/C0_and_C1_control_codes) control set (control characters mapped to bytes 0 to 31) from ISO 646 and the [C1](https://www.wikiwand.com/en/C0_and_C1_control_codes#/C1_set) control set (control characters mapped to bytes 128 to 159) from ISO 6429, resulting in full 8-bit character maps with most, if not all, bytes assigned. From: [ISO/IEC 8859](https://www.wikiwand.com/en/ISO/IEC_8859)

Because it is impossible to fit all characters from all languages the 8859 standards is broken into 16 different code pages represented by a different number in the extension. For example: `8859-1` corresponds to the basic Latin alphabet used in English and most Western European countries; `8859-14` represents Celtic languages, such as Irish, Manx, Scottish Gaelic, Welsh, Cornish, and Breton.

Two final things to know about these encodings.

Because they only include printable characters the 8859 character sets lack typographical tools such as ligatures, curly quotation marks, dashes and others. To work with high-end typography many programs use Unicode or provide their own additions to the 8859 standards for a given language.

The specifications are no longer being actively maintained. The working group that developed the 8859 standards disbanded in June 2004. The only working group that works in character sets is concentrating efforts in Unicode's [Universal Coded Character Set (UCS)](https://www.wikiwand.com/en/Universal_Coded_Character_Set) defined in ISO/IEC 10646.

### Unicode

So now we come to **Unicode**. Unlike ISO 8859 and ASCII, Unicode provides a unified registry for all languages. The codepoint for a letter in a given alphabet will not change regardless of the code page the character and its associated language is in.

> The Unicode Standard provides a unique number for every character, no matter what platform, device, application or language. It has been adopted by all modern software providers and now allows data to be transported through many different platforms, devices, and applications without corruption. Support of Unicode forms the foundation for the representation of languages and symbols in all major operating systems, search engines, browsers, laptops, and smart phones—plus the Internet and World Wide Web (URLs, HTML, XML, CSS, JSON, etc.). Supporting Unicode is the best way to implement ISO/IEC 10646. From [What is Unicode?](http://unicode.org/standard/WhatIsUnicode.html)

Unicode is not a font or a font system. It makes it easier for font developers to know what characters are contained in each page and make it easier to support one language or family of languages per font and it also makes it easier to know that if a font supports Unicode for a given code page the characters will be the same no matter what OS or what tool we're using.

Also, because we are dealing with languages other than English where most characters require one byte to be represented we may have to use more than one byte to represent a character.

That's where the UTF-8 encoding comes in.

UTF-8 (Unicode Transformation Format - 8 bit) encodes each of the 1,112,064 valid code points in Unicode using one to four 8-bit bytes or octet in Unicode parlance. The first 128 characters (equivalent to US-ASCII) need one byte. The next 1,920 characters need two bytes to encode, which covers the remainder of almost all Latin-script alphabets, and also Greek, Cyrillic, Coptic, Armenian, Hebrew, Arabic, Syriac, Thaana and N'Ko alphabets, as well as [Combining Diacritical Marks](https://www.wikiwand.com/en/Plane_(Unicode)#/Basic_Multilingual_Plane). Three bytes are needed for characters in the rest of the [Basic Multilingual Plane](https://www.wikiwand.com/en/Plane_(Unicode)#/Basic_Multilingual_Plane), which contains virtually all characters in common use including most CJK (Chinese, Japanese and Korean) characters. Four bytes are needed for characters in the other planes of Unicode, which include less common CJK characters, various historic scripts, mathematical symbols, and emoji (pictographic symbols).

Paragraph adapted and condensed from Wikipedia's [UTF-8 entry](https://www.wikiwand.com/en/UTF-8)

### So why is this important?

If we're going to cover a language in our web pages, we owe it to the users in that country to treat it correctly and to provide fonts that actually work with the languages in question. It also forces Unicode to stay up to date with languages to avoid problems like those that happened in Myanmar/Burma.

Because there has been little or no development of the Internet in Myanmar there was no real desire to work on Fonts that supported the Myanmar languages as a commercial venture or for anyone outside Myanmar to support the development of free fonts. Myanmar's cell phone usage was 1% in 2010, exploding to over 80% in 2016, and about 80% of those are smartphones. Google Search launched as google.com.mm in March 2013, including a Burmese user interface. Facebook added Burmese language support in June 2013, and the list of supporting companies continues to grow.

The solution was a locally developed font called Zawgyi. It became highly popular and the majority font use in Myanmar. We'll come back to Zawgyi when we compare it to Unicode.

It wasn't until Unicode 3.0 that a code block was assigned to Myanmar and related languages, currrently (as of version 10.0.0) includes 160 code points (U+1000..U+109F) for Burmese, Mon, Karen, Kayah, Shan, and Palaung languages of Myanmar. It is also used to write Pali and Sanskrit in Myanmar.

The presentations below from IMUG's July Meeting illustrate the issue better than I can and in a lot more detail than I have space for in this article.

<iframe width="560" height="315" src="https://www.youtube.com/embed/3tIEUQ5rGLA?rel=0" frameborder="0" allowfullscreen></iframe>

Unicode came into the picture after Zawgyi was released and the conflicts within them make the two fonts incompatible and working with one means that characters may not render well with the other. Zawgi takes the code points that Unicode uses for other languages on the code block and uses them for Burmese glyphs without providing replacement code points for those other languages.

So as front end developers targeting content to Myanmar we have three options. We use Zawqgyi and let our Unicode users suffer when the text in Myanmar or any of the other languages in the code block display properly, we use fonts that support Unicode and hope that our users have the same or similar fonts installed or we use English and hope our target audience can understand what we're saying.

The point is, again, to walk a mile in our users' shoes. How would you handle this disconnect between the font that people use in Myanmar and how you handle the people who chose not to use your idea (Zawgyi or Unicode) to view your content?
