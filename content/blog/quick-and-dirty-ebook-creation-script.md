---
title: "Quick and dirty ebook creation script"
date: "2014-08-23"
categories: 
  - "technology"
---

After creating all the content for an ebook there is still more work to do and I can't always remember the exact commands to run to finish the book. I do remember that I have to do the following:

- Delete the existing version of the book (if any) to make sure that changes are picked up in the final product
- Delete all .DS\_Store directories created in my Mac. This may not always be necessary but avoids epubcheck errors if you forget to remove the directory from one of the files being compressed
- Zip all files to the zipped epub container
- Runs epubcheck on the resulting epub file

\[code lang=bash\] #!/bin/sh

#1. removes the existing epub file (if any) rm -rf mybook.epub echo "book file deleted"

#2. Remove .DS\_Store file find . -type f -name '\*.DS\_Store' -ls -delete echo "deleted mac specific files"

#3. Zip the necessary files and directories zip -r -X mybook.epub mimetype META-INF OEBPS

#4. Run epubcheck on the resulting file from step 3 java -jar /usr/local/java/epubcheck/epubcheck-3.0/epubcheck-3.0.jar mybook.epub

#5. All Done :-) echo "All Done"

#open mybook.epub \[/code\]
