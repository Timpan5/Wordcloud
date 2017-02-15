Rails.application.routes.draw do
  root 'comments#totalScore'
  get '/totalscore', to: 'comments#totalScore'
  get '/wordcloud', to: 'comments#wordcloud'
  post '/retrieve', to: 'comments#retrieve'
  post '/append', to: 'comments#append'
  get '/comments/:username', to: 'comments#old'
end
