pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'sriramakula212/devops-project' // Docker image name
        DOCKER_TAG = 'latest'
        REGISTRY = 'https://index.docker.io/v1/' // Docker Hub
        REGISTRY_CREDENTIALS = 'dockerhub-creds' // Jenkins credential ID for Docker Hub
        GITHUB_CREDENTIALS = 'GitHub-Token' // Jenkins credential ID for GitHub (to access your private repo)
    }

    stages {
        stage('Checkout') {
            steps {
                // Pull code from your Git repository using GitHub credentials
                git credentialsId: "${GITHUB_CREDENTIALS}", url: 'https://github.com/SriramAkula/Devops_Proj.git' // GitHub repo URL
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
            }
        }

        stage('Push to Docker Hub') {
            when {
                branch 'main'
            }
            steps {
                script {
                    docker.withRegistry("${REGISTRY}", REGISTRY_CREDENTIALS) {
                        docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").push()
                    }
                }
            }
        }

        stage('Deploy to Server') {
            when {
                branch 'main'
            }
            steps {
                script {
                    sh '''
                        ssh -o StrictHostKeyChecking=no user@your-server-ip << EOF
                            docker pull ${DOCKER_IMAGE}:${DOCKER_TAG}
                            docker stop devops-project || true
                            docker rm devops-project || true
                            docker run -d -p 8888:80 --name devops-project ${DOCKER_IMAGE}:${DOCKER_TAG}
                        EOF
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ Build and deployment successful!'
        }
        failure {
            echo '❌ Build or deployment failed.'
        }
    }
}
