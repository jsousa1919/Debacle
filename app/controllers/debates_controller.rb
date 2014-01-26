class DebatesController < ApplicationController

  respond_to :json

  def all
  end

  def index
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
    @debate = Debate.new(debate_params)
    if @debate.save
      redirect_to action: "index"
    else
      render :new
    end
  end

  def show
    @debate = Debate.find(params[:id])
  end


  private

    def debate_params
      params.require(:debate).permit(:title, :description)
    end

end
