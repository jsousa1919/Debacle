class SessionsController < Devise::SessionsController
  respond_to :json

  def create
    resource = warden.authenticate!(:scope => resource_name, :recall => "#{controller_path}#failure")
    sign_in(resource_name, resource)
    render :status => 200,
      :json => { :success => true,
      :info => "Logged in",
      :user => current_user
      }
  end

  def destroy
    #warden.authenticate!(:scope => resource_name, :recall => "#{controller_path}#failure")
    #sign_out(resource_name)
    puts current_user
    #resource.destroy
    signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
    puts current_user
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
    reject_if_not_authorized_request!
    warden.authenticate!(:scope => resource_name, :recall => "#{controller_path}#failure")
    auth = current_user.authorizations.find_by_user_id(current_user.id)
    #if current_user
    #  url = .url
    #end
    render :status => 200,
      :json => { :success => true,
      :info => "Current User",
      :user => current_user,
      :auth => auth
    }
  end

  def reject_if_not_authorized_request!
    warden.authenticate!(
      scope: resource_name,
      recall: "#{controller_path}#failure")
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
