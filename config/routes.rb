Rails.application.routes.draw do
  scope '/ansible' do
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

    resources :ansible_roles, :only => [:index, :destroy] do
      collection do
        get :import
        post :confirm_import
      end
    end
  end
end
