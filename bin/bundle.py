#!/usr/bin/env python3

import os
import gzip

import minify_html
from jinja2 import Environment, select_autoescape, FileSystemLoader



def main():
    env = Environment(
        loader=FileSystemLoader(["html", "lib"]),
        autoescape=select_autoescape()
    )

    ###
    # one big file for the bootloader

    template = env.get_template("bootloader.html.j2")

    # minified = minify_html.minify(
    #     template.render(),
    #     minify_css=True,
    #     minify_js=True,
    # )

    with open("var/www/index.html", "w") as f:
        f.write(template.render())

    ###
    # 2-stage loader with separate compressed file

    template = env.get_template("dappz.bin.j2")
    with gzip.open("var/www/dappz.bin", "wt") as f:
        f.write(template.render())

    template = env.get_template("tiny.html.j2")
    with open("var/www/tiny", "w") as f:
        f.write(template.render())

    print("ok")


if __name__ == "__main__":
    main()
