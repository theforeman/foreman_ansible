# Releasing new Ansible version
**Before checks**
* Check if Foreman’s required version in [register.rb](https://github.com/theforeman/foreman_ansible/blob/master/lib/foreman_ansible/register.rb) needs to be changed.
* In case you want to start doing the release in the same PR with another commit, make sure that the version bump in [version.rb](https://github.com/theforeman/foreman_ansible/blob/master/lib/foreman_ansible/version.rb) is in a separate commit.
* All [redmine tickets](https://projects.theforeman.org/projects/ansible/issues) have correct release version
* Correct versioning (see [Semantic versioning](https://semver.org/#semantic-versioning-200))

```
X.0.0 - Required Foreman version have been changed
0.X.0 - Major feature have been merged
0.0.X - Small fix
```

**Release process**

For following actions you need to have access to [rubygems.org](https://rubygems.org/gems/foreman_ansible) and permissions for creating tags in the Github repository.

* Pull latest `master` or `X.X-stable` branch
* `bundle exec rake release`
* Push tag: `git push upstream vX.X.X`

## Foreman Packaging

For setup of Foreman packaging follow instructions here: [rpm/develop](https://github.com/theforeman/foreman-packaging/tree/rpm/develop) and [deb/develop](https://github.com/theforeman/foreman-packaging/tree/deb/develop)

**RPM**

* Pull latest `rpm/develop` or `rpm/X.X-stable`
* Checkout to the `rpm/develop` or `rpm/X.X-stable` and create new branch
* Bump version to the latest: `./bump_rpm.sh packages/plugins/rubygem-foreman_ansible/`
* For specific version: `./bump_rpm.sh packages/plugins/rubygem-foreman_ansible 7.1.2`
* With `git diff` verify the changes
* Push a PR

**DEB**
* Pull latest `deb/develop` or `deb/X.X-stable`
* Create new branch
* Bump version: `scripts/update_package.rb -n foreman-ansible -v X.X.X`
* git commit -am "Updated foreman-ansible to X.X.X"
* Push a PR

