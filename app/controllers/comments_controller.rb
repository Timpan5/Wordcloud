class CommentsController < ApplicationController
  def totalScore
  end

  def wordcloud
  end

  def retrieve
    @comment = (Comment.where(username: params[:username])).first
    #check count
    if @comment
      if @comment.updated_at > 2.minutes.ago
        p "Recent"
        render :json => @comment
      else
        p "Old"
        @comment.destroy
        @comment = Comment.new(:username => params[:username], :count => params[:count])
        @comment.save
        render :status => 404
      end
    else
      p "Fail"
      @comment = Comment.new(:username => params[:username], :count => params[:count])
      @comment.save
      render :status => 404
    end
  end

  def append
    @comment = (Comment.where(username: params[:username])).first
    p "In"
    (@comment.data).push(params[:comments])
    @comment.save
  end

  def old
    @comment = (Comment.where(username: params[:username])).first
    render :json => @comment
  end

end