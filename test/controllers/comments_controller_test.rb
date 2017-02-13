require 'test_helper'

class CommentsControllerTest < ActionDispatch::IntegrationTest
  test "should get totalScore" do
    get comments_retrieve_url
    assert_response :success
  end

end