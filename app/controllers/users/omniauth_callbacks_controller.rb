class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def stackexchange
    user = User.find_for_oauth(request.env["omniauth.auth"])
    debugger
    if user.persisted?
      flash[:notice] = I18n.t "devise.omniauth_callbacks.success", :kind => "Stackexchange"
        sign_in_and_redirect user, :event => :authentication
    else
      session["devise.stackexchange_data"] = request.env["omniauth.auth"]
      redirect_to new_user_registration_url
    end
  end
end
