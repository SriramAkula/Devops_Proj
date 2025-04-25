pipeline {
    agent any

    options {
        timeout(time: 30, unit: 'MINUTES') // ⏱️ Prevents checkout timeout
    }

    environment {
        DOCKER_IMAGE = 'sriramakula212/devops-project' // Docker image name
        DOCKER_TAG = 'latest'
        REGISTRY = 'https://index.docker.io/v1/' // Docker Hub
        REGISTRY_CREDENTIALS = 'dockerhub-creds' // Jenkins credential ID for Docker Hub
        GITHUB_CREDENTIALS = 'GitHub-Token' // Jenkins credential ID for GitHub (to access your private repo)
    }

    stages {
        stage('Clean Workspace') {
            steps {
                // 🧹 Remove all files from the workspace to avoid .git issues
                deleteDir()
            }
        }

        stage('Clone Repo') {
            steps {
                // ⚡ Faster clone with shallow history
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']], // Adjust branch name as needed (e.g., '*/master')
                    userRemoteConfigs: [[
                        url: 'https://github.com/SriramAkula/Devops_Proj.git',
                        credentialsId: "${GITHUB_CREDENTIALS}"
                    ]],
                    extensions: [[$class: 'CloneOption', depth: 1, shallow: true]]
                ])
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image with the specified tag
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
            }
        }

        stage('Push to Docker Hub') {
            when {
                branch 'main' // Push to Docker Hub only for the main branch
            }
            steps {
                script {
                    // Login to Docker Hub and push the built image
                    withCredentials([usernamePassword(credentialsId: "${REGISTRY_CREDENTIALS}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh '''
                            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                            docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:${DOCKER_TAG}
                            docker push ${DOCKER_IMAGE}:${DOCKER_TAG}
                        '''
                    }
                }
            }
        }

        stage('Deploy to Server') {
            when {
                branch 'main' // Deploy only on the main branch
            }
            steps {
                script {
                    // Replace with actual server IP and deploy the container
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
