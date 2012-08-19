# coding: utf-8
import os
from fabric.api import run, env, cd, roles

env.roledefs['production'] = ['adw0rd@jsjs.ru:2442']


def production_env():
    env.user = 'adw0rd'
    # env.key_filename = [os.path.join(os.environ['HOME'], '.ssh', 'git_uniwebs')]
    env.root = '/home/adw0rd/work/django-lictor'
    env.project_root = '/home/adw0rd/work/django-lictor/test_project'
    env.python = '/home/adw0rd/work/django-lictor/venv/bin/python'
    env.pip = '/home/adw0rd/work/django-lictor/venv/bin/pip'
    env.pidfile = '/tmp/test_project.pid'
    env.socket = '/tmp/test_project.sock'
    env.outlog = '/var/log/test_project/out.log'
    env.errlog = '/var/log/test_project/err.log'


@roles('production')
def deploy():
    production_env()
    with cd(env.project_root):
        run('git pull origin master')
        run('{} manage.py collectstatic --noinput'.format(env.python))
        run('{} manage.py syncdb'.format(env.python))
        try:
            run('{} manage.py migrate'.format(env.python))
        except:
            pass


@roles('production')
def pip_install():
    production_env()
    run('{pip} install --upgrade -r {filepath}'.format(pip=env.pip,
        filepath=os.path.join(env.root, 'requirements.txt')))
    run('{pip} install --upgrade -r {filepath}'.format(pip=env.pip,
        filepath=os.path.join(env.project_root, 'requirements.txt')))


@roles('production')
def runfcgi_stop():
    production_env()
    run('kill `cat {pidfile}`'.format(pidfile=env.pidfile))
    try:
        from time import sleep
        sleep(2)
        run('kill -9 `cat {pidfile}`'.format(pidfile=env.pidfile))
    except:
        pass


@roles('production')
def runfcgi_start():
    production_env()
    run('{python} {project_root}/manage.py runfcgi socket={socket} method=prefork '
        'pidfile={pidfile} minspare=2 maxspare=10 maxchildren=3 maxrequests=100 '
        'outlog={outlog} errlog={errlog} umask=000 workdir={project_root}'.format(**dict(env)))


@roles('production')
def runfcgi_restart():
    runfcgi_stop()
    runfcgi_start()
