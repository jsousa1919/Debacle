class Debate < ActiveRecord::Base
  has_many :sides
  accepts_nested_attributes_for :sides
end
