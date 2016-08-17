Rails.application.routes.draw do
  scope :ansible, :path => '/ansible', :as => 'ansible' do
    constraints(:id => %r{[^\/]+}) do
      resources :hosts, :only => [] do
        member do
          get :play_roles
        end
        collection do
          get :multiple_play_roles
        end
      end
    end
  end
end
