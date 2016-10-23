# Sourcerer.nvim

## Usage

Just type a query into your editor and run `:Sourcerer` to query Stackoverflow. Select the answer you want and it appears in your editor

## Setup

Works with any VIM plugin manager. Here's an example with [vim-plug](https://github.com/junegunn/vim-plug)

```
Plug 'DonnieWest/sourcerer.nvim'
```

## Configuration

To set comment style for your filetype:

```
autocmd FileType vim setlocal g:sourcerer_comment_text='"'
```

Defaults to '//'


To set the minimum number of votes to be included in the selection:

```
let g:sourcerer_minimum_votes = 50
```

To set the minimum snippets shown

```
let g:sourcerer_minimum_snippets = 3
```

If you always want the first answer found

```
let g:sourcerer_feeling_lucky = 0
```

If you want the rest of the answer from stack overflow inserted

```
let g:sourcerer_insert_answer_text = 1
```


## Credits

Based on code from the excellent [sourcerer](https://github.com/NickTikhonov/sourcerer) by @NickTikhonov
