Rails.application.routes.draw do
  root 'comments#totalScore'

  get '/wordcloud', to: 'comments#wordcloud'
end
