FROM node

# Create app directory
WORKDIR ~/serv
ENV PATH ./node_modules/.bin:$PATH

# Bundle app source
COPY . .

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production



EXPOSE 3333
#CMD ["npm", "start"]
CMD ["bash"]
