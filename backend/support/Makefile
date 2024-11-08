build:
	mkdir -p $(ARTIFACTS_DIR)
	cp -R $(LAMBDA_FILE) $(ARTIFACTS_DIR)/
	
	cp -R common/ $(ARTIFACTS_DIR)/
	
	python3 -m pip install -r common/requirements.txt -t $(ARTIFACTS_DIR)/

	rm -rf $(ARTIFACTS_DIR)/bin

build-CreateTicketFunction:
	$(MAKE) build LAMBDA_FILE=CreateTicket/*.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)

build-DeleteTicketFunction:
	$(MAKE) build LAMBDA_FILE=CreateTicket/*.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)

build-FetchReceivedTicketsFunction:
	$(MAKE) build LAMBDA_FILE=FetchReceivedTickets/*.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)

build-FetchSentTicketsFunction:
	$(MAKE) build LAMBDA_FILE=FetchSentTickets/*.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)
