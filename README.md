# TP DevOps Correction Docker

Ce dépôt contient :
- la stack Docker locale du TP ;
- la CI GitHub Actions qui teste le backend et publie les images Docker ;
- la partie Ansible pour provisionner le serveur Debian et y déployer l'application ;
- le front Vue servi derrière le proxy HTTPD.

Le serveur ciblé par défaut est `fatimetou.abdel-mola.takima.school` avec l'utilisateur `admin`.

## Pré-requis

- Docker Desktop
- Java 21 + Maven
- Homebrew sur macOS
- la clé privée SSH fournie pour le serveur Takima

## Installer Ansible

```bash
brew install ansible
ansible --version
```

## Préparer la clé SSH

```bash
chmod 400 /chemin/vers/id_rsa
export TAKIMA_SSH_KEY_PATH=/chemin/vers/id_rsa
export ANSIBLE_PRIVATE_KEY_FILE="$TAKIMA_SSH_KEY_PATH"
```

## Tester l'accès au serveur

```bash
ssh -i "$TAKIMA_SSH_KEY_PATH" admin@fatimetou.abdel-mola.takima.school
exit
```

Puis tester la connectivité Ansible :

```bash
cd ansible
ansible all -m ping
```

## Ansible

Depuis `ansible/`, tu as maintenant trois entrées :
- `playbook.yml` pour tester la connectivité Ansible ;
- `docker.yml` pour installer Docker sur le serveur Debian ;
- `deploy.yml` pour déployer la stack Docker complète avec base de données, API, front et proxy via les modules `docker_container` / `docker_network`.

Avant d'exécuter `deploy.yml`, assure-toi d'avoir poussé les derniers changements sur `main` pour que GitHub Actions republie les images `latest` sur DockerHub.

Commandes principales :

```bash
cd ansible
export ANSIBLE_PRIVATE_KEY_FILE=/Users/souzi_mola/Downloads/id_rsa
ansible-galaxy collection install -r requirements.yml
ansible all -m ping
ansible-playbook playbook.yml
ansible-playbook docker.yml
ansible-playbook deploy.yml
```

## Variables à adapter

Si ton namespace DockerHub n'est pas `fatimetoumola`, modifie `dockerhub_username` dans `ansible/group_vars/all.yml`.

## Local vs distant

- `docker-compose.yaml` à la racine construit les images localement.
- `ansible/deploy.yml` déploie à distance avec des rôles Ansible et les modules Docker.
- `.github/workflows/main.yml` build, pousse et déploie automatiquement le backend, la base, le proxy et le frontend après un push sur `main`.

La documentation détaillée des commandes du TP Ansible est dans [ansible/README.md](/Users/souzi_mola/tp-devops-correction-docker/ansible/README.md:1).
