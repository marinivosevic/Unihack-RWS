build:
	mkdir -p $(ARTIFACTS_DIR)
	cp -R $(LAMBDA_FILE) $(ARTIFACTS_DIR)/
	
	cp -R common/ $(ARTIFACTS_DIR)/
	
	python3 -m pip install -r common/requirements.txt -t $(ARTIFACTS_DIR)/

	rm -rf $(ARTIFACTS_DIR)/bin

build-GetAllSuperchargersInACityFunction:
	$(MAKE) build LAMBDA_FILE=GetAllSuperchargersInACity/*.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)
