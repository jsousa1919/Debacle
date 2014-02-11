class CreateSides < ActiveRecord::Migration
  def change
    create_table :sides do |t|
      t.references :debate, index: true
      t.string :title

      t.timestamps
    end
  end
end
