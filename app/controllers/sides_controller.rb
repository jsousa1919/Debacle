class SidesController < ApplicationController
  belongs_to :debate
  respond_to :json
end
