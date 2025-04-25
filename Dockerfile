# Use an official Nginx image to serve the static site
FROM nginx:alpine

# Copy website files to the Nginx default public directory
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
