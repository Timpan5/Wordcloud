class CommentsController < ApplicationController
  def totalScore
  end

  def wordcloud
  end

  def retrieve
    @comment = (Comment.where(username: params[:username])).first
    if @comment
      if @comment.updated_at > 2.minutes.ago
        @comment.destroy
        render :status => 404
      else
        p "Success"
        render :json => @comment
      end
    else
      p "Fail"
      render :status => 404
    end
  end

end