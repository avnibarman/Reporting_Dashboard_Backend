FROM mhart/alpine-node:4

ARG BUILD_KEY
ARG BUILD_NUMBER

# Set npm registry
RUN npm config set registry http://sinopia.aeriscloud.com:8081

# Copy project files and download dependencies
WORKDIR /opt/aeris/aeris-webapi-seed
RUN mkdir -p ./package
ADD aeris-webapi-seed*.tgz ./
WORKDIR package
RUN npm install --production
# Update build key and number
RUN sed -i -- "s/BUILDKEY/$BUILD_KEY/g; s/BUILDNUMBER/$BUILD_NUMBER/g" ./build.json

# Expose UDP Port
EXPOSE 8080
EXPOSE 8443

# Start fleet webapp
CMD ["npm", "start"]
