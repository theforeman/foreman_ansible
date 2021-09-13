class AddOrganizationToAnsibleRoles < ActiveRecord::Migration[6.0]
  def up
    add_reference(:ansible_roles, :organization, foreign_key: { to_table: :taxonomies }, index: true)
    add_index(:ansible_roles, [:name, :organization_id], unique: true)

    User.as_anonymous_admin do
      default_org = Organization.first
      AnsibleRole.all.update_all(organization_id: default_org.id)
      AnsibleRole.all.each do |role|
        host_orgs = role.hosts.pluck(:organization_id, :id).group_by(&:first)
        hostgroup_orgs = Hostgroup.unscoped.joins(:hostgroup_ansible_roles, :organizations).
                         where(HostgroupAnsibleRole.arel_table[:ansible_role_id].eq(role.id)).
                         pluck(TaxableTaxonomy.arel_table[:taxonomy_id], :id)
        hostgroup_orgs = hostgroup_orgs.uniq(&:second).group_by(&:first)
        (host_orgs.keys | hostgroup_orgs.keys).each do |org_id|
          next if org_id == default_org.id || org_id.nil?
          cloned = role.clone_to_org!(org_id)
          role.host_ansible_roles.where(host_id: host_orgs[org_id].map(&:second)).update_all(ansible_role_id: cloned.id) if host_orgs.key?(org_id)
          role.hostgroup_ansible_roles.where(hostgroup_id: hostgroup_orgs[org_id].map(&:second)).update_all(ansible_role_id: cloned.id) if hostgroup_orgs.key?(org_id)
        end
      end
    end
  end

  def down
    remove_index(:ansible_roles, [:name, :organization_id])
    User.as_anonymous_admin do
      names = AnsibleRole.group(:name).where('COUNT(*) > 1').pluck(:name)
      names.each do |name|
        orgs = AnsibleRole.where(name: name).pluck(:organization_id)
        roles = AnsibleRole.where(name: name, organization_id: orgs[1..-1])
        theone = AnsibleRole.find_by(name: name, organization_id: orgs.first)
        HostAnsibleRole.where(ansible_role: roles).update_all(ansible_role_id: theone.id)
        HostgroupAnsibleRole.where(ansible_role: roles).update_all(ansible_role_id: theone.id)
      end
    end
    remove_reference(:ansible_roles, :organization)
  end
end
