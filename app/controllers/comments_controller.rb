class CommentsController < ApplicationController
  def totalScore
  end

  def wordcloud
  end

  def retrieve
    @comment = (Comment.where(username: params[:username])).first
    if @comment
      if @comment.updated_at > 2.minutes.ago
        p "Recent"
        render :json => @comment
      else
        p "Old"
        @comment.destroy
        render :status => 404
      end
    else
      p "Fail"
      @comment = Comment.new(:username => params[:username])
      @comment.save
      render :status => 404
    end
  end

  def append
    #@comment = (Comment.where(username: params[:username])).first


  end

end