# Ansible

## Inventaire du projet

L'inventaire du TP est défini dans [inventories/setup.yml](/Users/souzi_mola/tp-devops-correction-docker/ansible/inventories/setup.yml:1).

Structure :
- `all` regroupe tous les hôtes Ansible du projet ;
- `vars` définit l'utilisateur SSH `admin` et le chemin de la clé privée ;
- `prod` est le groupe d'hôtes de production ;
- `school-server` pointe vers `fatimetou.abdel-mola.takima.school`.

Si le chemin de ta clé change, mets à jour `ansible_ssh_private_key_file` dans `inventories/setup.yml`.

## Pré-requis Ansible

Les modules `community.docker.docker_container` et `community.docker.docker_network` viennent de la collection `community.docker`.

Installation locale :

```bash
ansible-galaxy collection install -r requirements.yml
```

## Commandes de base

Tester l'inventaire et la connexion SSH :

```bash
ansible all -i inventories/setup.yml -m ping
```

Récupérer les facts de distribution :

```bash
ansible all -i inventories/setup.yml -m ansible.builtin.setup -a "filter=ansible_distribution*"
```

Supprimer Apache2 en commande ad-hoc :

```bash
ansible all -i inventories/setup.yml -m ansible.builtin.apt -a "name=apache2 state=absent" --become
```

## Playbooks

Premier playbook de test :

```bash
ansible-playbook -i inventories/setup.yml --syntax-check playbook.yml
ansible-playbook -i inventories/setup.yml playbook.yml
```

Playbook avancé d'installation Docker :

```bash
ansible-playbook -i inventories/setup.yml --syntax-check docker.yml
ansible-playbook -i inventories/setup.yml docker.yml
```

Playbook de déploiement complet de la stack avec rôles :

```bash
ansible-playbook -i inventories/setup.yml --syntax-check deploy.yml
ansible-playbook -i inventories/setup.yml deploy.yml
```

## Ce que fait chaque playbook

- [playbook.yml](/Users/souzi_mola/tp-devops-correction-docker/ansible/playbook.yml:1) vérifie juste la connectivité Ansible avec `ping`.
- [docker.yml](/Users/souzi_mola/tp-devops-correction-docker/ansible/docker.yml:1) appelle le rôle [roles/docker](/Users/souzi_mola/tp-devops-correction-docker/ansible/roles/docker/tasks/main.yml:1) pour installer Docker sur Debian.
- [deploy.yml](/Users/souzi_mola/tp-devops-correction-docker/ansible/deploy.yml:1) appelle les rôles `docker`, `network`, `database`, `app` et `proxy`.

## Rôles utilisés

- [roles/docker](/Users/souzi_mola/tp-devops-correction-docker/ansible/roles/docker/tasks/main.yml:1) installe Docker et le SDK Python Docker sur le serveur.
- [roles/network](/Users/souzi_mola/tp-devops-correction-docker/ansible/roles/network/tasks/main.yml:1) crée le réseau Docker applicatif avec `community.docker.docker_network`.
- [roles/database](/Users/souzi_mola/tp-devops-correction-docker/ansible/roles/database/tasks/main.yml:1) lance PostgreSQL avec `community.docker.docker_container`.
- [roles/app](/Users/souzi_mola/tp-devops-correction-docker/ansible/roles/app/tasks/main.yml:1) lance l’API Spring Boot avec ses variables d’environnement.
- [roles/proxy](/Users/souzi_mola/tp-devops-correction-docker/ansible/roles/proxy/tasks/main.yml:1) lance le proxy HTTPD exposé sur le port 80.
- [roles/cleanup_legacy](/Users/souzi_mola/tp-devops-correction-docker/ansible/roles/cleanup_legacy/tasks/main.yml:1) supprime les anciens conteneurs `docker compose` pour éviter les conflits de port.

Le playbook de déploiement utilise `ansible_python_interpreter={{ docker_module_python_interpreter }}` pour que les modules Docker s’exécutent avec le Python du virtualenv qui contient le SDK Docker.

## Vérifier que tout fonctionne

1. Vérifier Ansible et l’accès serveur :

```bash
ansible all -i inventories/setup.yml -m ping
ansible all -i inventories/setup.yml -m ansible.builtin.setup -a "filter=ansible_distribution*"
```

2. Vérifier Docker :

```bash
ansible all -i inventories/setup.yml -m command -a "docker --version" --become
ansible all -i inventories/setup.yml -m command -a "docker compose version" --become
ansible all -i inventories/setup.yml -m shell -a "systemctl is-active docker" --become
```

3. Vérifier réseau et conteneurs :

```bash
ansible all -i inventories/setup.yml -m shell -a "docker network ls" --become
ansible all -i inventories/setup.yml -m shell -a "docker ps" --become
```

4. Vérifier l’application :

```bash
curl http://fatimetou.abdel-mola.takima.school
curl http://fatimetou.abdel-mola.takima.school/students
```

5. Vérifier en SSH si besoin :

```bash
ssh -i /Users/souzi_mola/Downloads/id_rsa admin@fatimetou.abdel-mola.takima.school
sudo docker ps
sudo docker network inspect tp-devops-network
curl http://localhost
```

## Références

- Docker Debian install: https://docs.docker.com/engine/install/debian/
- Ansible playbooks: https://docs.ansible.com/projects/ansible/latest/getting_started/get_started_playbook.html
- Ansible YAML inventory: https://docs.ansible.com/projects/ansible-core/devel/collections/ansible/builtin/yaml_inventory.html
- Ansible setup module: https://docs.ansible.com/projects/ansible-core/2.18/collections/ansible/builtin/setup_module.html
- Ansible docker_container module: https://docs.ansible.com/ansible/latest/collections/community/docker/docker_container_module.html
- Ansible docker_network module: https://docs.ansible.com/projects/ansible/latest/collections/community/docker/docker_network_module.html
