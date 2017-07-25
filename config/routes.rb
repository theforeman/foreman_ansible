Rails.application.routes.draw do
  scope '/ansible' do
    constraints(:id => %r{[^\/]+}) do
      resources :hosts, :only => [] do
        member do
          get :play_roles
          post :play_ad_hoc_role
        end
        collection do
          get :multiple_play_roles
        end
      end
      resources :hostgroups, :only => [] do
        member do
          get :play_roles
          post :play_ad_hoc_role
        end
      end
    end

    resources :ansible_roles, :only => [:index, :destroy] do
      collection do
        get :import
        post :confirm_import
      end
    end

    namespace :api do
      scope '(:apiv)',
            :module      => :v2,
            :defaults    => { :apiv => 'v2' },
            :apiv        => /v1|v2/,
            :constraints => ApiConstraints.new(:version => 2) do

        constraints(:id => %r{[^\/]+}) do
          resources :hosts, :only => [] do
            member do
              post :play_roles
              post :play_ad_hoc_role
            end
            collection do
              post :multiple_play_roles
            end
          end

          resources :hostgroups, :only => [] do
            member do
              post :play_roles
              post :play_ad_hoc_role
            end
            collection do
              post :multiple_play_roles
            end
          end
        end

        resources :ansible_roles, :only => [:show, :index, :destroy] do
          collection do
            put :import
            put :obsolete
          end
        end
      end
    end
  end
end
