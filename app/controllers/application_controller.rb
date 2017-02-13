class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  def home
  end

  def execute_psql(query)
    results = ActiveRecord::Base.connection.exec_query(query)
    if results.present?
      return results
    else
      return nil
    end
  end

end
