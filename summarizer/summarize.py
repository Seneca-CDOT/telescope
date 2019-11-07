 #!/usr/bin/python3.6

"""Blog Summarizer

This script allows the user to summarize the content of a blog post.

This tool current accepts only a text file path.

Requires Python 3.6.x

Dependencies:
    - gensim

This file can also be imported as a module and contains the following
functions:

    * get_spreadsheet_cols - returns the column headers of the file
    * main - the main function of the script
"""

import sys
from gensim.summarization.summarizer import summarize


def readFile():
    """Opens the file and stores its contents

    Returns
    -------
    string
        A string containing the document content
    """
    
    if len(sys.argv) > 1: # File name should be the first parameter
        return open(sys.argv[1],'r').read()

def summarizeText(text):
    """Gets text and returns its summary

    Parameters
    ----------
    text : str
        A document to summarize

    Returns
    -------
    str
        The document summary
    """
    return summarize(text)

def main():
    text = readFile()
    text = summarizeText(text)
    print(text)
    sys.stdout.flush()


if __name__ == '__main__':
    main()