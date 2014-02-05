class SessionsController < Devise::SessionsController
  respond_to :json

  def create
    resource = warden.authenticate!(:scope => resource_name, :recall => "#{controller_path}#failure")
    render :status => 200,
      :json => { :success => true,
      :info => "Logged in",
      :user => current_user
      }
  end

  def destroy
    warden.authenticate!(:scope => resource_name, :recall => "#{controller_path}#failure")
    sign_out
    render :status => 200,
      :json => { :success => true,
      :info => "Logged out",
    }
  end

  def failure
    render :status => 401,
      :json => { :success => false,
      :info => "Login Credentials Failed"
    }
  end

  def show_current_user
    warden.authenticate!(:scope => resource_name, :recall => "#{controller_path}#failure")
    render :status => 200,
      :json => { :success => true,
      :info => "Current User",
      :user => current_user
    }
  end

  #def create
  #  @user = User.find_or_create_from_auth_hash(auth_hash)
  #  self.current_user = @user
  #  redirect_to '/'
  #end

  #protected

  #  def auth_hash
  #    request.env['omniauth.auth']
  #  end
end
