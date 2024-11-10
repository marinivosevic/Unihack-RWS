build:
	mkdir -p $(ARTIFACTS_DIR)
	cp -R $(LAMBDA_FILE) $(ARTIFACTS_DIR)/
	
	cp -R common/ $(ARTIFACTS_DIR)/
	
	python3 -m pip install -r common/requirements.txt -t $(ARTIFACTS_DIR)/

	rm -rf $(ARTIFACTS_DIR)/bin

build-CreateNewsForCityFunction:
	$(MAKE) build LAMBDA_FILE=CreateNewsForCity/*.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)

build-DeleteNewsForCityFunction:
	$(MAKE) build LAMBDA_FILE=DeleteNewsForCity/*.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)

build-UpdateNewsForCityFunction:
	$(MAKE) build LAMBDA_FILE=UpdateNewsForCity/*.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)

build-GetAllNewsForCityFunction:
	$(MAKE) build LAMBDA_FILE=GetAllNewsForCity/*.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)

build-GetNewsByIdFunction:
	$(MAKE) build LAMBDA_FILE=GetNewsById/*.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)
