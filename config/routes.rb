# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api, defaults: { format: 'json' } do
    scope '(:apiv)',
          :module => :v2,
          :defaults => { apiv: 'v2' },
          :apiv => /v2/,
          :constraints => ApiConstraints.new(version: 2, default: true) do
      resources :hosts, :only => [] do
        member do
          post :play_roles
          get :ansible_roles
          post :assign_ansible_roles
          put 'ansible_roles/:ansible_role_id', :to => 'hosts#add_ansible_role'
          delete 'ansible_roles/:ansible_role_id', :to => 'hosts#remove_ansible_role'
        end
        collection do
          post :multiple_play_roles
        end
      end
      resources :hostgroups, :only => [] do
        member do
          post :play_roles
          get :ansible_roles
          post :assign_ansible_roles
          put 'ansible_roles/:ansible_role_id', :to => 'hostgroups#add_ansible_role'
          delete 'ansible_roles/:ansible_role_id', :to => 'hostgroups#remove_ansible_role'
        end
        collection do
          post :multiple_play_roles
        end
      end
    end
  end
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
      resources :hostgroups, :only => [] do
        member do
          get :play_roles
        end
      end
    end

    resources :ansible_roles, :only => [:index, :destroy] do
      collection do
        get :import
        post :confirm_import
        get 'auto_complete_search'
      end
    end

    resources :ui_ansible_roles, :only => [:index]

    resources :ansible_variables, :except => [:show] do
      resources :lookup_values, :only => [:index, :create, :update, :destroy]
      collection do
        get :import
        post :confirm_import
        get 'auto_complete_search'
      end
    end

    namespace :api do
      scope '(:apiv)',
            :module => :v2,
            :defaults => { :apiv => 'v2' },
            :apiv => /v1|v2/,
            :constraints => ApiConstraints.new(:version => 2, :default => true) do
        resources :ansible_roles, :only => [:show, :index, :destroy] do
          collection do
            put :import
            put :sync
            put :obsolete
            get :fetch
          end
        end

        resources :ansible_playbooks, :only => [] do
          collection do
            get :fetch
            put :sync
          end
        end

        resources :ansible_variables, :only => [:show, :index, :destroy, :update, :create] do
          collection do
            put :import
            put :obsolete
          end
        end

        resources :ansible_override_values, :only => [:create, :destroy]

        resources :ansible_inventories, :only => [] do
          collection do
            post :hosts
            get :hosts
            post :hostgroups
            get :hostgroups
            post :schedule
          end
        end
      end
    end
  end

  match '/ansible/hostgroups' => 'react#index', :via => [:get]
  match '/ansible/hostgroups/*page' => 'react#index', :via => [:get]
end
