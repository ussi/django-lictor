from setuptools import setup, find_packages

setup(
    name='django-lictor',
    version="0.0.1-alpha",
    description="Reusable application for visualization of Django-project",
    long_description="",
    keywords='django, visualization',
    author='Mikhail Andreev',
    author_email='x11org@gmail.com',
    url='http://github.com/ussi/django-lictor',
    license='BSD',
    packages=find_packages(),
    zip_safe=False,
    install_requires=['Django', 'South', 'simplejson', 'distribute'],
    include_package_data=True,
    classifiers=[
        "Programming Language :: Python",
        "Framework :: Django",
        "Environment :: Web Environment",
    ],
)
