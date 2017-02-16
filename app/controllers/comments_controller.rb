class CommentsController < ApplicationController
  def totalScore
  end

  def wordcloud
  end

  def retrieve
    @comment = (Comment.where(username: params[:username])).first
    #check count
    if @comment
      if (@comment.updated_at > 2.minutes.ago)&& (@comment.count == params[:count].to_i)
        render :json => @comment
      else
        @comment.destroy
        @comment = Comment.new(:username => params[:username], :count => params[:count])
        @comment.save
        render :status => 404
      end
    else
      @comment = Comment.new(:username => params[:username], :count => params[:count])
      @comment.save
      render :status => 404
    end
  end

  def append
    @comment = (Comment.where(username: params[:username])).first
    @comment.weighted = params[:weighted];
    @comment.unweighted = params[:unweighted];
    @comment.save
  end

  def old
    @comment = (Comment.where(username: params[:username])).first
    render :json => @comment
  end

end