DOCKERNAME = main-vue
DOCKERIMAGE = main-vue
image:
	docker build -t $(DOCKERIMAGE) .
clean:
	docker rmi $(DOCKERIMAGE)
run:
	docker run --name $(DOCKERNAME) -p 9000:80 $(DOCKERIMAGE)
run-d:
	docker run --name $(DOCKERNAME) -d -p 9000:80 $(DOCKERIMAGE)
restart:
	docker restart $(DOCKERNAME)
stop:
	docker stop $(DOCKERNAME)
start:
	docker start $(DOCKERNAME)
del:
	docker rm -f $(DOCKERNAME)
exec:
	docker exec -it $(DOCKERNAME) sh



