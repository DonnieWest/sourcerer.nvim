if exists('g:loaded_sourcerer')
  finish
endif

let g:loaded_sourcerer = 1

let g:sourcerer_minimum_votes =
      \ get(g:, 'sourcerer_minimum_votes', 50)
let g:sourcerer_minimum_snippets =
      \ get(g:, 'sourcerer_minimum_snippets', 3)
let g:sourcerer_feeling_lucky =
      \ get(g:, 'sourcerer_feeling_lucky', 0)
let g:sourcerer_insert_answer_text =
      \ get(g:, 'sourcerer_insert_answer_text', 1)
let g:sourcerer_comment_text =
      \ get(g:, 'sourcerer_comment_text', '//')
