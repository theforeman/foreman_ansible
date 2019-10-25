#
# Makefile for PO merging and MO generation. More info in the README.
#
# make all-mo (default) - generate MO files
# make check - check translations using translate-tool
# make tx-update - download and merge translations from Transifex
# make clean - clean everything
#
DOMAIN = foreman_ansible
VERSION = $(shell ruby -e 'require "rubygems";spec = Gem::Specification::load(Dir.glob("../*.gemspec")[0]);puts spec.version')
POTFILE = $(DOMAIN).pot
MOFILE = $(DOMAIN).mo
POFILES = $(shell find . -name '*.po')
MOFILES = $(patsubst %.po,%.mo,$(POFILES))
POXFILES = $(patsubst %.po,%.pox,$(POFILES))

%.mo: %.po
	mkdir -p $(shell dirname $@)/LC_MESSAGES
	msgfmt -o $(shell dirname $@)/LC_MESSAGES/$(MOFILE) $<

# Generate MO files from PO files
all-mo: $(MOFILES)

# Check for malformed strings
%.pox: %.po
	msgfmt -c $<
	pofilter --nofuzzy -t variables -t blank -t urls -t emails -t long -t newlines \
		-t endwhitespace -t endpunc -t puncspacing -t options -t printf -t validchars --gnome $< > $@
	cat $@
	! grep -q msgid $@

check: $(POXFILES)
	msgfmt -c ${POTFILE}

# Merge PO files
update-po:
	for f in $(shell find ./ -name "*.po") ; do \
		msgmerge -N --backup=none -U $$f ${POTFILE} ; \
	done

# Unify duplicate translations
uniq-po:
	for f in $(shell find ./ -name "*.po") ; do \
		msguniq $$f -o $$f ; \
	done

tx-pull:
	tx pull -f
	for f in $(POFILES) ; do \
		sed -i 's/^\("Project-Id-Version: \).*$$/\1$(DOMAIN) $(VERSION)\\n"/' $$f; \
	done
	-git commit -a -m "i18n - pulling from tx"

reset-po:
	# merging po files is unnecessary when using transifex.com
	git checkout -- ../locale/*/*po

tx-update: tx-pull reset-po $(MOFILES)
	# amend mo files
	git add ../locale/*/LC_MESSAGES
	git commit -a --amend -m "i18n - pulling from tx"
	-echo Changes commited!

mo-files: $(MOFILES)
	git add $(POFILES) $(POTFILE) ../locale/*/LC_MESSAGES
	git commit -m "i18n - pulling from tx"
	@echo
	@echo Changes commited!
	@echo
