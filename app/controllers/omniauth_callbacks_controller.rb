class OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def stackexchange
    auth_hash = request.env["omniauth.auth"]
    auth_hash = env["omniauth.auth"]
    uid = auth_hash['extra']['raw_info']['id']
    name = auth_hash['extra']['raw_info']['display_name']
    url = auth_hash['extra']['raw_info']['link']
    auth = Authorization.find_by_provider_and_uid("stackexchange", uid)
    if auth
      ## We already know about this user who is signing in with
      # the provider: just return the user associated with the Authorization
      user = auth.user
    else
      ## Is a user signed in already? If not, then find or create
      # the user
      unless current_user
        unless user = User.find_by_name(name)
          user = User.create({
            name: name,
            password: Devise.friendly_token[0,8],
            email: "#{UUIDTools::UUID.random_create}@debacle.com"
          })
        end
      else
        user = current_user
      end

      ## Finally, create an authorization for the current user
      unless auth = user.authorizations.find_by_provider("stackexchange")
        auth = user.authorizations.build(provider: "stackexchange")
        user.authorizations << auth
      end
      auth.update_attributes({
          uid: uid,
          token: auth_hash['credentials']['token'],
          #secret: auth_hash['credentials']['secret'],
          name: name,
          url: url
          #url: "http://twitter.com/#{name}"
        })
    end
    if user
      sign_in_and_redirect user, :event => :authentication
    else
      redirect_to :new_user_registration
    end
  end
end
