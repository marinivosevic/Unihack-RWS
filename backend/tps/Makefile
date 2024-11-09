build:
	mkdir -p $(ARTIFACTS_DIR)
	cp -R $(LAMBDA_FILE) $(ARTIFACTS_DIR)/
	
	cp -R common/ $(ARTIFACTS_DIR)/
	
	python3 -m pip install -r common/requirements.txt -t $(ARTIFACTS_DIR)/

	rm -rf $(ARTIFACTS_DIR)/bin

build-GetAllSuperchargersInACityFunction:
	$(MAKE) build LAMBDA_FILE=GetAllSuperchargersInACity/* ARTIFACTS_DIR=$(ARTIFACTS_DIR)

build-CreateNewSuperchargerInACityFunction:
	$(MAKE) build LAMBDA_FILE=CreateNewSuperchargerInACity/*.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)

build-DeleteSuperchargerInACityFunction:
	$(MAKE) build LAMBDA_FILE=DeleteSuperchargerInACity/*.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)

build-UpdateSuperchargerInACityFunction:
	$(MAKE) build LAMBDA_FILE=UpdateSuperchargerInACity/*.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)

build-GetAllGarbageCansInACityFunction:
	$(MAKE) build LAMBDA_FILE=GetAllGarbageCansInACity/*.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)

# build-CreateNewGarbageCansInACityFunction:
# 	$(MAKE) build LAMBDA_FILE=CreateNewGarbageCansInACity/*.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)

# build-DeleteGarbageCansInACityFunction:
# 	$(MAKE) build LAMBDA_FILE=DeleteGarbageCansInACity/*.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)

# build-UpdateGarbageCansInACityFunction:
# 	$(MAKE) build LAMBDA_FILE=UpdateGarbageCansInACity/*.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)