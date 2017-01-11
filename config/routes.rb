Rails.application.routes.draw do
  root 'comments#totalScore'
  get '/totalscore', to: 'comments#totalScore'
  get '/wordcloud', to: 'comments#wordcloud'
end
