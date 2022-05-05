from distutils.core import setup

setup(
    name='phac_altdev_mapwebapp',
    version='1.3dev',
    packages=['phac_altdev_mapwebapp',],
    package_data={
    'WebApp':['static/*.*','templates/*.*','*.png']},
    url='https://www.tudorcentretrust-nonmotorizedtravelsurvey.com/',
    author='TransportationPlanner',
    author_email='sklump@dowl.com',
    license='Creative Commons Attribution-Noncommercial-Share Alike license',
    install_requires=['matplotlib'],
    long_description=open('README.txt').read(),
)