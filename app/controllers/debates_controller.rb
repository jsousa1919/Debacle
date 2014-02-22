class DebatesController < ApplicationController

  respond_to :json
  wrap_parameters include: [:title, :description, :sides_attributes]

  # hack until i can get csrf working
  before_filter :authenticate_user!, :except => :index
  protect_from_forgery :secret => 'any_phrase',  
                        :except => :create

  def all
  end

  def index
    #puts current_user
    @debates = Debate.all
    render status: 200,
          json: {
            data_test: 'test',
            debates: Debate.all
          }
  end

  def new
    @debate = Debate.new
    puts @debate.inspect
  end

  def show
  end

  def create
    debate = Debate.new(debate_params)
    if debate.save
      render status: 200,
        json: {
          success: debate.persisted?,
          debate_id: debate.id
        }
    else
      render status: 400,
        json: {
          success: debate.persisted?
        }
    end
  end

  def show
    @debate = Debate.find(params[:id])
  end


  private

    def debate_params
      params.require(:debate).permit(:title, :description, sides_attributes: [:id, :title])
    end

end
